package com.evcharging.dao;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.evcharging.model.LoginModel;
import com.evcharging.model.UserModel;


import jakarta.persistence.EntityManager;

@Repository
public class UserDaoImpl implements UserDao {
	
	@Autowired
	EntityManager em;
		
	@Override
	public UserModel SaveUser(UserModel user) {
		Session session = em.unwrap(Session.class); 
		session.persist(user);
		return user;
	}

	@Override
	public List<UserModel> doLogin(LoginModel log) {
		// TODO Auto-generated method stub
		Session session = em.unwrap(Session.class);
		List<UserModel> list = session.createQuery("from UserModel U where U.email='"+log.getEmail()+"' and U.password='"+log.getPassword()+"'").list();
		List<UserModel> list1 = list.size() >0 ? list:null;
		return list1;
	}

}
