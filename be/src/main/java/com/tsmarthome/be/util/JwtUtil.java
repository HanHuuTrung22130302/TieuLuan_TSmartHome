package com.tsmarthome.be.util;

import com.tsmarthome.be.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private Key key;

    @PostConstruct
    public void init() {
        // Dùng secret key cố định từ config, đảm bảo token vẫn hợp lệ sau khi restart backend
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // 1. HÀM TẠO TOKEN (ĐÃ SỬA ĐỂ THÊM CUSTOM CLAIMS)
    public String generateToken(User user) {
        // Tạo một cái "túi" để đựng các thông tin phụ (Custom Claims)
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("fullName", user.getFirstName() + " " + user.getLastName());

        return Jwts.builder()
                .setClaims(claims) // Nhét cái túi đó vào Payload
                .setSubject(user.getEmail()) // Vẫn giữ nguyên Subject là email để Spring Security dễ tìm kiếm
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key)
                .compact();
    }

    // 2. HÀM LẤY EMAIL TỪ TOKEN
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 3. HÀM KIỂM TRA TOKEN
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // --- CÁC HÀM TIỆN ÍCH DÙNG TRONG NỘI BỘ ---
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}