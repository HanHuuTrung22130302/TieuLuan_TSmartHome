package com.tsmarthome.be.service;

import com.tsmarthome.be.dto.room.response.RoomResponse;
import com.tsmarthome.be.entity.Room;
import com.tsmarthome.be.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomResponse> getAllRooms() {
        List<Room> rooms = roomRepository.findAllOrderedByName();
        return rooms.stream().map(room -> RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .build()
        ).collect(Collectors.toList());
    }
}