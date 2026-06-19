package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.home.response.HomeResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.entity.UserHome;
import com.tsmarthome.be.repository.UserHomeRepository;
import com.tsmarthome.be.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/homes")
@RequiredArgsConstructor
public class HomeController {

    private final SecurityUtil securityUtil;
    private final UserHomeRepository userHomeRepository;

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<HomeResponse>>> getMyHomes() {
        User user = securityUtil.getCurrentUser();
        List<UserHome> userHomes = userHomeRepository.findByUserId(user.getId());
        List<HomeResponse> responses = userHomes.stream()
                .map(uh -> HomeResponse.builder()
                        .id(uh.getHome().getId())
                        .name(uh.getHome().getName())
                        .role(uh.getRole())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách ngôi nhà thành công", responses));
    }
}
