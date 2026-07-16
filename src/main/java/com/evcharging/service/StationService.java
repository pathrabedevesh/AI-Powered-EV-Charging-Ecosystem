package com.evcharging.service;

import java.util.List;

import com.evcharging.model.StationModel;

public interface StationService {

	public StationModel saveStation(StationModel sm);
	public List<StationModel> getAllStation();
	List<StationModel> getMyStations(int ownerId);
}
