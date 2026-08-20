package com.evcharging.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.evcharging.model.BookingModel;
import com.evcharging.service.BookingService;

@RestController
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    
    @PostMapping("/saveBooking")
    public String saveBooking(@RequestBody BookingModel booking) {

        booking.setStatus("Pending");

        return bookingService.saveBooking(booking);
    }

    
    @GetMapping("/myBookings/{userId}")
    public List<BookingModel> getUserBookings(@PathVariable int userId) {

        return bookingService.getUserBookings(userId);
    }

    
    @GetMapping("/ownerBookings/{ownerId}")
    public List<BookingModel> getOwnerBookings(@PathVariable int ownerId) {

        return bookingService.getOwnerBookings(ownerId);
    }

    @GetMapping("/booking/{bookingId}")
    public BookingModel getBooking(@PathVariable int bookingId) {

        return bookingService.getBookingById(bookingId);
    }

    @PutMapping("/cancelBooking/{bookingId}")
    public String cancelBooking(@PathVariable int bookingId) {

        return bookingService.cancelBooking(bookingId);
    }

    
    @PutMapping("/completeBooking/{bookingId}")
    public String completeBooking(@PathVariable int bookingId) {

        return bookingService.completeBooking(bookingId);
    }

}