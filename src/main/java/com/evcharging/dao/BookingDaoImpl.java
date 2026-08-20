package com.evcharging.dao;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.evcharging.model.BookingModel;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Repository
public class BookingDaoImpl implements BookingDao {

    @Autowired
    private EntityManager entityManager;

    @Override
    @Transactional
    public String saveBooking(BookingModel booking) {

        Session session = entityManager.unwrap(Session.class);

        session.persist(booking);

        return "Booking Saved Successfully";
    }

    @Override
    public List<BookingModel> getUserBookings(int userId) {

        Session session = entityManager.unwrap(Session.class);

        List<BookingModel> list = session.createQuery(
                "from BookingModel",
                BookingModel.class)
                .list();

        System.out.println(list.size());

        return list;
    }

    @Override
    public List<BookingModel> getOwnerBookings(int ownerId) {

        Session session = entityManager.unwrap(Session.class);

        return session.createQuery(
                "from BookingModel where station.owner.id=:oid",
                BookingModel.class)
                .setParameter("oid", ownerId)
                .list();
    }

    @Override
    public BookingModel getBookingById(int bookingId) {

        Session session = entityManager.unwrap(Session.class);

        return session.get(BookingModel.class, bookingId);
    }

    @Override
    @Transactional
    public String cancelBooking(int bookingId) {

        Session session = entityManager.unwrap(Session.class);

        BookingModel booking = session.get(BookingModel.class, bookingId);

        if (booking != null) {

            booking.setStatus("Cancelled");

            session.merge(booking);

            return "Booking Cancelled";
        }

        return "Booking Not Found";
    }

    @Override
    @Transactional
    public String completeBooking(int bookingId) {

        Session session = entityManager.unwrap(Session.class);

        BookingModel booking = session.get(BookingModel.class, bookingId);

        if (booking != null) {

            booking.setStatus("Completed");

            session.merge(booking);

            return "Booking Completed";
        }

        return "Booking Not Found";
    }

}