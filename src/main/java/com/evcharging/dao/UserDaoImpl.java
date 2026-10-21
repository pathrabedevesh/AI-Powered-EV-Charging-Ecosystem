
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
    private EntityManager em;

    @Override
    public UserModel SaveUser(UserModel user) {
        Session session = em.unwrap(Session.class);
        session.persist(user);
        return user;
    }

    @Override
    public List<UserModel> doLogin(LoginModel log) {
        Session session = em.unwrap(Session.class);

        return session.createQuery(
                "FROM UserModel u WHERE u.email = :email " +
                "AND u.password = :password",
                UserModel.class)
            .setParameter("email", log.getEmail().trim())
            .setParameter("password", log.getPassword())
            .getResultList();
    }

    @Override
    public UserModel getUserById(int id) {
        Session session = em.unwrap(Session.class);
        return session.get(UserModel.class, id);
    }
}
