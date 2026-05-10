package com.tsmarthome.be.dto.auth.request;
import lombok.Getter; import lombok.Setter;
@Getter @Setter
public class VerifyOtpRequest { private String email; private String otpCode; }