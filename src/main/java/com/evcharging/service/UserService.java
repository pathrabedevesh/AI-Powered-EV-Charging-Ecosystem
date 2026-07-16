package com.evcharging.service;

import java.util.List;

import com.evcharging.model.LoginModel;
import com.evcharging.model.UserModel;

public interface UserService {

	public UserModel SaveUser(UserModel user);
	public List<UserModel> doLogin(LoginModel log);
}
