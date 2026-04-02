package com.unibuzz.crm.repository;

import com.unibuzz.crm.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByFacultyEmail(String facultyEmail);
}
