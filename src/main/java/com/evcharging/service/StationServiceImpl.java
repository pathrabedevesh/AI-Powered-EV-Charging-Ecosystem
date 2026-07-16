package com.evcharging.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.evcharging.dao.StationDao;
import com.evcharging.model.StationModel;

@Service
public class StationServiceImpl implements StationService {
	
	@Autowired
	StationDao stationdao;

	@Transactional
	@Override
	public StationModel saveStation(StationModel sm) {
		// TODO Auto-generated method stub
		return stationdao.saveStation(sm);
	}

	@Transactional
	@Override
	public List<StationModel> getAllStation() {
		// TODO Auto-generated method stub
		return stationdao.getAllStation();
	}

	@Transactional
	@Override
	public List<StationModel> getMyStations(int ownerId) {
		// TODO Auto-generated method stub
		return stationdao.getMyStations(ownerId);
	}
	
	

}
