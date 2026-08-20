package com.evcharging.dao;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.evcharging.model.StationModel;

import jakarta.persistence.EntityManager;

@Repository
public class StationDaoImpl implements StationDao {
	
	@Autowired
	EntityManager em;

	@Override
	public StationModel saveStation(StationModel sm) {
		// TODO Auto-generated method stub
		Session session = em.unwrap(Session.class);
		session.persist(sm);
		return sm;
	}

	@Override
	public List<StationModel> getAllStation() {
		// TODO Auto-generated method stub
		Session session = em.unwrap(Session.class);
		
		return session.createQuery("from StationModel", StationModel.class).getResultList();
	}
	
	@Override
	public List<StationModel> getMyStations(int ownerId){

	    Session session = em.unwrap(Session.class);

	    return session.createQuery(
	        "from StationModel where owner.id=:id",
	        StationModel.class)
	        .setParameter("id", ownerId)
	        .getResultList();
	}

	@Override
	public StationModel deleteStation(int stationId) {
		// TODO Auto-generated method stub
		Session session = em.unwrap(Session.class);
		StationModel station = session.get(StationModel.class, stationId);
		
		if(station != null)
			session.remove(station);
		
		return station;
	}

}
