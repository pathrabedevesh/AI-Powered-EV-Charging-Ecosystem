package com.evcharging.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	UserService userservice;
	
	@PostMapping("save-user")
	public String SaveUser(@RequestBody UserModel user) {
		//TODO: process POST request
		userservice.SaveUser(user);
		return "success";
	}
	
	@PostMapping("dologin")
	public String doLogin(@RequestBody LoginModel log) {
		//TODO: process POST request
		
		String status = null;
		
		List<UserModel> list = userservice.doLogin(log);
		
		if(list!=null)
			status = "Success";
		else
			status = "Failed";
		
		return status;
	}
	
	
	
}
