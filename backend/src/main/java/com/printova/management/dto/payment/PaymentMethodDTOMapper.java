package com.printova.management.dto.payment;

import com.printova.management.model.payment.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class PaymentMethodDTOMapper implements Function<PaymentMethod, PaymentMethodDTO> {

    @Override
    public PaymentMethodDTO apply(PaymentMethod paymentMethod) {
        return new PaymentMethodDTO(
                paymentMethod.getPaymentMethodId(),
                paymentMethod.getPaymentMethodCode(),
                paymentMethod.getPaymentMethodName()
        );
    }
}