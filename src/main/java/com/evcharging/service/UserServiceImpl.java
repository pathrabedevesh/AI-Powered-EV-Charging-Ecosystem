package com.evcharging.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evcharging.dao.UserDao;
import com.evcharging.model.LoginModel;
import com.evcharging.model.UserModel;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userdao;
	
	@Transactional
	@Override
	public UserModel SaveUser(UserModel user) {
		// TODO Auto-generated method stub
		return userdao.SaveUser(user);
	}

	@Transactional
	@Override
	public List<UserModel> doLogin(LoginModel log) {
		// TODO Auto-generated method stub
		return userdao.doLogin(log);
	}

}
