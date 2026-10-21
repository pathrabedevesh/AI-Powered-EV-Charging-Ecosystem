
package com.evcharging.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.evcharging.model.LoginModel;
import com.evcharging.model.UserModel;
import com.evcharging.service.UserService;

@CrossOrigin
@RestController
public class UserController {

    @Autowired
    private UserService userservice;

    @PostMapping("save-user")
    public String saveUser(@RequestBody UserModel user) {
        userservice.SaveUser(user);
        return "success";
    }

    @PostMapping("dologin")
    public ResponseEntity<?> doLogin(@RequestBody LoginModel log) {

        List<UserModel> list = userservice.doLogin(log);

        if (list != null && !list.isEmpty()) {
            UserModel user = list.get(0);

            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullname", user.getFullname(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password."));
    }
}
