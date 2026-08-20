package com.evcharging.dao;

import java.util.List;

import com.evcharging.model.StationModel;

public interface StationDao {

	public StationModel saveStation(StationModel sm);
	public List<StationModel> getAllStation();
	
	public List<StationModel> getMyStations(int ownerId);
	public StationModel deleteStation(int stationId);
}
