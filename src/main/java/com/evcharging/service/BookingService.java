package com.evcharging.service;

import java.util.List;

import com.evcharging.model.BookingModel;

public interface BookingService {

    String saveBooking(BookingModel booking);

    List<BookingModel> getUserBookings(int userId);

    List<BookingModel> getOwnerBookings(int ownerId);

    BookingModel getBookingById(int bookingId);

    String cancelBooking(int bookingId);

    String completeBooking(int bookingId);

}