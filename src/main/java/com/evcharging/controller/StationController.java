package com.evcharging.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.evcharging.model.StationModel;
import com.evcharging.service.StationService;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin
public class StationController {

	@Autowired
	StationService stationservice;
	
	@PostMapping("saveStation")
	public StationModel saveStation(@RequestBody StationModel station) {
		
		return stationservice.saveStation(station);
	}
	
	
	
	@GetMapping("/myStations/{ownerId}")
	public List<StationModel> getMyStations(@PathVariable int ownerId){
	    return stationservice.getMyStations(ownerId);
	}
	
	@DeleteMapping("/deleteStation/{stationId}")
	public StationModel DeleteStation(@PathVariable int stationId) {
		return stationservice.deleteStation(stationId);
	}
	
	@GetMapping("/getStation")
	public List<StationModel> getAllStation(){
		return stationservice.getAllStation();
	}
	
}
