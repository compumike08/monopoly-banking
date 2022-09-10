package mh.michael.monopolybanking.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Slf4j
public class OptionalUtil {
    private OptionalUtil() {}

    public static <T> T getTypeFromOptionalOrThrowNotFound(Optional<T> optionalObj, String notFoundReturnMsg, long idSearchingFor) {
        if (optionalObj.isEmpty()) {
            log.error(notFoundReturnMsg + " - id searched for: " + idSearchingFor);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, notFoundReturnMsg);
        }

        return optionalObj.get();
    }
}
