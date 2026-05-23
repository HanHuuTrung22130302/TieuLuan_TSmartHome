package com.tsmarthome.be.controller;

import com.tsmarthome.be.dto.room.response.RoomResponse;
import com.tsmarthome.be.dto.response.ApiResponse;
import com.tsmarthome.be.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getRoomList() {
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy danh sách phòng thành công", rooms));
    }
}