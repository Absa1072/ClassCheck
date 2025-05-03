## REQ-1: Attendance Not Marked Due to Disabled or Inaccurate Geolocation
**Description:** The system must detect when a student arrives at their scheduled class location
but fails to be marked present due to disabled or inaccurate geolocation services.

**Business Concepts/Operations:**

* Relies on geolocation tracking to verify attendance

* Allow students to manually verify if tracking fails

* Instructors can review and override attendance records when necessary


**User Story:** As a student, I want to be notified if my geolocation is inaccurate or disabled so that I can take appropriate action to verify my attendance.

## REQ-2: Attendance Affected Due to Traffic/Public Transportation Delays
**Description:** The system must allow students to report unexpected delays due to traffic or public transportation issues and request attendance exceptions.

**Business Concepts/Operations:**

* Students experiencing delays due to traffic or public transport can submit delay reports
  
* Instructors review these requests and approve or reject them based on validity


**User Story:** As a student, I want to report transportation delays so that my attendance can be considered despite circumstances beyond my control.


