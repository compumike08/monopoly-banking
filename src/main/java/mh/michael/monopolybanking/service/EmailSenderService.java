package mh.michael.monopolybanking.service;

import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.resource.Emailv31;
import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.ForgotPasswordRequestDTO;
import mh.michael.monopolybanking.model.User;
import mh.michael.monopolybanking.repository.UserRepository;
import mh.michael.monopolybanking.security.JwtTokenUtil;
import mh.michael.monopolybanking.security.JwtUserDetails;
import mh.michael.monopolybanking.util.EmailValidationUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class EmailSenderService {
    @Value("${mailjet.apiKey}")
    private String mailjetApiKey;

    @Value("${mailjet.secretKey}")
    private String mailjetSecretKey;

    @Value("${mailjet.senderEmailAddress}")
    private String mailjetSenderEmailAddress;

    @Value("${mailjet.senderEmailName}")
    private String mailjetSenderEmailName;

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public EmailSenderService(
            UserRepository userRepository,
            JwtTokenUtil jwtTokenUtil
    ) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public void processForgotEmailRequest(ForgotPasswordRequestDTO forgotPasswordRequestDTO, String baseUrl) {
        if (forgotPasswordRequestDTO.getEmail() == null ||
                forgotPasswordRequestDTO.getEmail().length() < 1 ||
                !EmailValidationUtil.emailPatternMatches(forgotPasswordRequestDTO.getEmail())
        ) {
            log.warn("Invalid or missing email address input when requesting to send forgot password email");
            return;
        }

        Optional<User> optUser = userRepository.findByEmail(forgotPasswordRequestDTO.getEmail());

        if (optUser.isEmpty()) {
            log.warn("Email address not found when requesting to send forgot password email: " + forgotPasswordRequestDTO.getEmail());
            return;
        }

        User user = optUser.get();
        String token = jwtTokenUtil.generateTokenForForgotPassword(user);

        sendForgotPasswordEmail(user.getEmail(), user.getUsername(), token, baseUrl);
    }

    private void sendForgotPasswordEmail(String toEmailAddress, String toEmailName, String forgotPasswordToken, String baseUrl) {
        String msgBodyHtml = "<h3>Click link to reset password: <a href=\"" + baseUrl + "/resetPassword?token=" + forgotPasswordToken + "\">Reset Password</a>!</h3>";

        try {
            sendEmail(toEmailAddress, toEmailName, "Reset Password", msgBodyHtml);
        } catch (MailjetException e) {
            log.error("Mailjet Exception", e);
        }
    }

    public void sendEmail(String toEmailAddress, String toEmailName, String subject, String msgBodyHtml) throws MailjetException {
        MailjetClient client;
        MailjetRequest request;
        MailjetResponse response;

        client = new MailjetClient(ClientOptions.builder()
                .apiKey(mailjetApiKey)
                .apiSecretKey(mailjetSecretKey)
                .build());

        request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                        .put(new JSONObject()
                                .put(Emailv31.Message.FROM, new JSONObject()
                                        .put("Email", mailjetSenderEmailAddress)
                                        .put("Name", mailjetSenderEmailName))
                                .put(Emailv31.Message.TO, new JSONArray()
                                        .put(new JSONObject()
                                                .put("Email", toEmailAddress)
                                                .put("Name", toEmailName)))
                                .put(Emailv31.Message.SUBJECT, subject)
                                .put(Emailv31.Message.HTMLPART, msgBodyHtml)));

        response = client.post(request);
        log.debug(String.valueOf(response.getStatus()));
        log.debug(response.getData().join(";"));
    }
}
