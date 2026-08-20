package com.evcharging.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
public class StationModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int stationId;
	
	private String stationName;
	private String address;
	private String city;
	private String chargerType;
	private double pricePerKwh;
	private int totalSlots;
	private int availableSlots;
	private String status;
	
	@ManyToOne
	@JoinColumn(name = "owner_id")
	private UserModel owner;
	
	public UserModel getOwner() {
		return owner;
	}
	public void setOwner(UserModel owner) {
		this.owner = owner;
	}
	public int getStationId() {
		return stationId;
	}
	public void setStationId(int stationId) {
		this.stationId = stationId;
	}
	public String getStationName() {
		return stationName;
	}
	public void setStationName(String stationName) {
		this.stationName = stationName;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getChargerType() {
		return chargerType;
	}
	public void setChargerType(String chargerType) {
		this.chargerType = chargerType;
	}
	public double getPricePerKwh() {
		return pricePerKwh;
	}
	public void setPricePerKwh(double pricePerKwh) {
		this.pricePerKwh = pricePerKwh;
	}
	public int getTotalSlots() {
		return totalSlots;
	}
	public void setTotalSlots(int totalSlots) {
		this.totalSlots = totalSlots;
	}
	public int getAvailableSlots() {
		return availableSlots;
	}
	public void setAvailableSlots(int availableSlots) {
		this.availableSlots = availableSlots;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}
