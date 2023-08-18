package mh.michael.monopolybanking.service;

import lombok.extern.slf4j.Slf4j;
import mh.michael.monopolybanking.dto.PropertyDTO;
import mh.michael.monopolybanking.model.Property;
import mh.michael.monopolybanking.repository.PropertyRepository;
import mh.michael.monopolybanking.util.ConvertDTOUtil;
import mh.michael.monopolybanking.util.OptionalUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PropertyService {
    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Transactional
    public List<PropertyDTO> getAllProperties() {
        List<Property> propertyList = propertyRepository.findAll();
        return ConvertDTOUtil.convertPropertyListToPropertyDTOList(propertyList);
    }

    @Transactional
    public PropertyDTO getPropertyById(long id) {
        Optional<Property> optPropery = propertyRepository.findById(id);
        Property foundProperty = OptionalUtil.getTypeFromOptionalOrThrowNotFound(
                optPropery,
                "Property not found",
                id
        );

        return ConvertDTOUtil.convertPropertyToPropertyDTO(foundProperty);
    }
}
