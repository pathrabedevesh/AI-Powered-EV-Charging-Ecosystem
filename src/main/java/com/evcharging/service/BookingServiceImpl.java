package com.evcharging.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evcharging.dao.BookingDao;
import com.evcharging.model.BookingModel;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingDao bookingDao;

    @Override
    public String saveBooking(BookingModel booking) {
        return bookingDao.saveBooking(booking);
    }

    @Override
    public List<BookingModel> getUserBookings(int userId) {
        return bookingDao.getUserBookings(userId);
    }

    @Override
    public List<BookingModel> getOwnerBookings(int ownerId) {
        return bookingDao.getOwnerBookings(ownerId);
    }

    @Override
    public BookingModel getBookingById(int bookingId) {
        return bookingDao.getBookingById(bookingId);
    }

    @Override
    public String cancelBooking(int bookingId) {
        return bookingDao.cancelBooking(bookingId);
    }

    @Override
    public String completeBooking(int bookingId) {
        return bookingDao.completeBooking(bookingId);
    }

}