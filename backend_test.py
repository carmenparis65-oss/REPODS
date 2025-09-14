#!/usr/bin/env python3
"""
Backend API Testing for Student Tracking App
Tests all CRUD operations for students, class settings, and app settings
"""

import requests
import json
import sys
from typing import Dict, List, Any

# Get backend URL from frontend .env file
BACKEND_URL = "https://student-tracker-77.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_student_ids = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def test_classes_endpoint(self):
        """Test GET /api/classes - Should return 9 default classes"""
        try:
            response = self.session.get(f"{self.base_url}/classes")
            
            if response.status_code != 200:
                self.log_test("GET /api/classes", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            classes = response.json()
            
            if len(classes) != 9:
                self.log_test("GET /api/classes", False, f"Expected 9 classes, got {len(classes)}")
                return False
                
            # Check for expected class names
            expected_classes = [
                "INFANTIL 3 AÑOS", "INFANTIL 4 AÑOS", "INFANTIL 5 AÑOS",
                "1º DE PRIMARIA", "2º DE PRIMARIA", "3º DE PRIMARIA",
                "4º DE PRIMARIA", "5º DE PRIMARIA", "6º DE PRIMARIA"
            ]
            
            class_names = [cls["class_name"] for cls in classes]
            missing_classes = [cls for cls in expected_classes if cls not in class_names]
            
            if missing_classes:
                self.log_test("GET /api/classes", False, f"Missing classes: {missing_classes}")
                return False
                
            # Verify each class has required fields
            for cls in classes:
                required_fields = ["id", "class_name", "teacher_name", "background_color"]
                missing_fields = [field for field in required_fields if field not in cls]
                if missing_fields:
                    self.log_test("GET /api/classes", False, f"Class {cls.get('class_name', 'unknown')} missing fields: {missing_fields}")
                    return False
                    
            self.log_test("GET /api/classes", True, f"Successfully retrieved {len(classes)} classes with all required fields")
            return True
            
        except Exception as e:
            self.log_test("GET /api/classes", False, f"Exception: {str(e)}")
            return False
            
    def test_app_settings_endpoint(self):
        """Test GET /api/settings - Should return app settings"""
        try:
            response = self.session.get(f"{self.base_url}/settings")
            
            if response.status_code != 200:
                self.log_test("GET /api/settings", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            settings = response.json()
            
            # Check required fields
            required_fields = ["id", "school_name", "home_image_url"]
            missing_fields = [field for field in required_fields if field not in settings]
            
            if missing_fields:
                self.log_test("GET /api/settings", False, f"Missing fields: {missing_fields}")
                return False
                
            if settings["school_name"] != "CEIP Josefina Carabias":
                self.log_test("GET /api/settings", False, f"Expected school name 'CEIP Josefina Carabias', got '{settings['school_name']}'")
                return False
                
            self.log_test("GET /api/settings", True, f"Successfully retrieved app settings: {settings['school_name']}")
            return True
            
        except Exception as e:
            self.log_test("GET /api/settings", False, f"Exception: {str(e)}")
            return False
            
    def test_create_student(self):
        """Test POST /api/students - Create a student with all fields"""
        try:
            # Test data with realistic Spanish names - INCLUDING father_name field
            student_data = {
                "first_and_last_name": "María García López",
                "class_name": "1º DE PRIMARIA",
                "mother_name": "Carmen López Ruiz",
                "mother_phone": "666123456",
                "father_name": "José García Martín",
                "father_phone": "677987654",
                "allergies": "Alergia a los frutos secos",
                "comments": "Estudiante muy aplicada"
            }
            
            response = self.session.post(f"{self.base_url}/students", json=student_data)
            
            if response.status_code != 200:
                self.log_test("POST /api/students", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            created_student = response.json()
            
            # Verify all fields are present and correct
            for key, expected_value in student_data.items():
                if created_student.get(key) != expected_value:
                    self.log_test("POST /api/students", False, f"Field {key}: expected '{expected_value}', got '{created_student.get(key)}'")
                    return False
                    
            # Verify ID was generated
            if not created_student.get("id"):
                self.log_test("POST /api/students", False, "No ID generated for student")
                return False
                
            self.created_student_ids.append(created_student["id"])
            self.log_test("POST /api/students", True, f"Successfully created student: {created_student['first_and_last_name']} (ID: {created_student['id']})")
            return created_student
            
        except Exception as e:
            self.log_test("POST /api/students", False, f"Exception: {str(e)}")
            return False
            
    def test_get_all_students(self):
        """Test GET /api/students - Get all students"""
        try:
            response = self.session.get(f"{self.base_url}/students")
            
            if response.status_code != 200:
                self.log_test("GET /api/students", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            students = response.json()
            
            if not isinstance(students, list):
                self.log_test("GET /api/students", False, f"Expected list, got {type(students)}")
                return False
                
            # Should have at least the student we created
            if len(students) == 0:
                self.log_test("GET /api/students", False, "No students returned")
                return False
                
            # Verify student structure
            for student in students:
                required_fields = ["id", "first_and_last_name", "class_name"]
                missing_fields = [field for field in required_fields if field not in student]
                if missing_fields:
                    self.log_test("GET /api/students", False, f"Student missing fields: {missing_fields}")
                    return False
                    
            self.log_test("GET /api/students", True, f"Successfully retrieved {len(students)} students")
            return students
            
        except Exception as e:
            self.log_test("GET /api/students", False, f"Exception: {str(e)}")
            return False
            
    def test_get_students_by_class(self, class_name: str = "1º DE PRIMARIA"):
        """Test GET /api/students/class/{class_name} - Get students by class (alphabetically sorted)"""
        try:
            # First create a few more students in the same class to test sorting
            test_students = [
                {
                    "first_and_last_name": "Ana Martín Sánchez",
                    "class_name": class_name,
                    "mother_name": "Isabel Sánchez",
                    "mother_phone": "666111222",
                    "father_name": "Miguel Martín Torres",
                    "father_phone": "666555777"
                },
                {
                    "first_and_last_name": "Carlos Rodríguez Pérez",
                    "class_name": class_name,
                    "mother_name": "Pilar Pérez",
                    "mother_phone": "666333444",
                    "father_name": "Antonio Rodríguez Silva",
                    "father_phone": "666888999"
                }
            ]
            
            # Create additional students
            for student_data in test_students:
                response = self.session.post(f"{self.base_url}/students", json=student_data)
                if response.status_code == 200:
                    self.created_student_ids.append(response.json()["id"])
            
            # Now test getting students by class
            response = self.session.get(f"{self.base_url}/students/class/{class_name}")
            
            if response.status_code != 200:
                self.log_test(f"GET /api/students/class/{class_name}", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            students = response.json()
            
            if not isinstance(students, list):
                self.log_test(f"GET /api/students/class/{class_name}", False, f"Expected list, got {type(students)}")
                return False
                
            if len(students) == 0:
                self.log_test(f"GET /api/students/class/{class_name}", False, "No students returned for class")
                return False
                
            # Verify all students belong to the correct class
            for student in students:
                if student["class_name"] != class_name:
                    self.log_test(f"GET /api/students/class/{class_name}", False, f"Student {student['first_and_last_name']} has wrong class: {student['class_name']}")
                    return False
                    
            # Verify alphabetical sorting
            names = [student["first_and_last_name"] for student in students]
            sorted_names = sorted(names, key=str.lower)
            
            if names != sorted_names:
                self.log_test(f"GET /api/students/class/{class_name}", False, f"Students not sorted alphabetically. Got: {names}, Expected: {sorted_names}")
                return False
                
            self.log_test(f"GET /api/students/class/{class_name}", True, f"Successfully retrieved {len(students)} students, properly sorted: {names}")
            return students
            
        except Exception as e:
            self.log_test(f"GET /api/students/class/{class_name}", False, f"Exception: {str(e)}")
            return False
            
    def test_update_student(self, student_id: str):
        """Test PUT /api/students/{id} - Update a student"""
        try:
            update_data = {
                "mother_name": "Carmen López Ruiz (Actualizado)",
                "father_name": "José García Martín (Actualizado)",
                "allergies": "Alergia a los frutos secos y lactosa",
                "comments": "Estudiante muy aplicada - Actualizado"
            }
            
            response = self.session.put(f"{self.base_url}/students/{student_id}", json=update_data)
            
            if response.status_code != 200:
                self.log_test(f"PUT /api/students/{student_id}", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            updated_student = response.json()
            
            # Verify updates were applied
            for key, expected_value in update_data.items():
                if updated_student.get(key) != expected_value:
                    self.log_test(f"PUT /api/students/{student_id}", False, f"Field {key}: expected '{expected_value}', got '{updated_student.get(key)}'")
                    return False
                    
            self.log_test(f"PUT /api/students/{student_id}", True, f"Successfully updated student: {updated_student['first_and_last_name']}")
            return updated_student
            
        except Exception as e:
            self.log_test(f"PUT /api/students/{student_id}", False, f"Exception: {str(e)}")
            return False
            
    def test_get_single_student(self, student_id: str):
        """Test GET /api/students/{id} - Get single student"""
        try:
            response = self.session.get(f"{self.base_url}/students/{student_id}")
            
            if response.status_code != 200:
                self.log_test(f"GET /api/students/{student_id}", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            student = response.json()
            
            if student.get("id") != student_id:
                self.log_test(f"GET /api/students/{student_id}", False, f"Wrong student returned. Expected ID: {student_id}, Got: {student.get('id')}")
                return False
                
            self.log_test(f"GET /api/students/{student_id}", True, f"Successfully retrieved student: {student['first_and_last_name']}")
            return student
            
        except Exception as e:
            self.log_test(f"GET /api/students/{student_id}", False, f"Exception: {str(e)}")
            return False
            
    def test_delete_student(self, student_id: str):
        """Test DELETE /api/students/{id} - Delete a student"""
        try:
            response = self.session.delete(f"{self.base_url}/students/{student_id}")
            
            if response.status_code != 200:
                self.log_test(f"DELETE /api/students/{student_id}", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
            result = response.json()
            
            if "message" not in result or "deleted successfully" not in result["message"].lower():
                self.log_test(f"DELETE /api/students/{student_id}", False, f"Unexpected response: {result}")
                return False
                
            # Verify student is actually deleted
            verify_response = self.session.get(f"{self.base_url}/students/{student_id}")
            if verify_response.status_code != 404:
                self.log_test(f"DELETE /api/students/{student_id}", False, f"Student still exists after deletion. Status: {verify_response.status_code}")
                return False
                
            self.log_test(f"DELETE /api/students/{student_id}", True, f"Successfully deleted student")
            return True
            
        except Exception as e:
            self.log_test(f"DELETE /api/students/{student_id}", False, f"Exception: {str(e)}")
            return False
            
    def test_father_name_field_scenarios(self):
        """Test specific scenarios for the father_name field"""
        try:
            # Test 1: Create student with father_name
            student_with_father = {
                "first_and_last_name": "Pedro Jiménez Vega",
                "class_name": "2º DE PRIMARIA",
                "mother_name": "Ana Vega Morales",
                "mother_phone": "666444555",
                "father_name": "Luis Jiménez Ruiz",
                "father_phone": "666777888",
                "allergies": "",
                "comments": "Test student for father_name field"
            }
            
            response = self.session.post(f"{self.base_url}/students", json=student_with_father)
            if response.status_code != 200:
                self.log_test("Father_name field - Create with father_name", False, f"Status code: {response.status_code}")
                return False
                
            created_student = response.json()
            if created_student.get("father_name") != student_with_father["father_name"]:
                self.log_test("Father_name field - Create with father_name", False, f"Expected '{student_with_father['father_name']}', got '{created_student.get('father_name')}'")
                return False
                
            student_id_1 = created_student["id"]
            self.created_student_ids.append(student_id_1)
            
            # Test 2: Create student without father_name (should default to empty string)
            student_without_father = {
                "first_and_last_name": "Elena Moreno Castro",
                "class_name": "3º DE PRIMARIA",
                "mother_name": "Rosa Castro López",
                "mother_phone": "666222333"
            }
            
            response = self.session.post(f"{self.base_url}/students", json=student_without_father)
            if response.status_code != 200:
                self.log_test("Father_name field - Create without father_name", False, f"Status code: {response.status_code}")
                return False
                
            created_student = response.json()
            if created_student.get("father_name") != "":
                self.log_test("Father_name field - Create without father_name", False, f"Expected empty string, got '{created_student.get('father_name')}'")
                return False
                
            student_id_2 = created_student["id"]
            self.created_student_ids.append(student_id_2)
            
            # Test 3: Update father_name field
            update_father_data = {"father_name": "Luis Jiménez Ruiz (Padre Actualizado)"}
            response = self.session.put(f"{self.base_url}/students/{student_id_1}", json=update_father_data)
            if response.status_code != 200:
                self.log_test("Father_name field - Update father_name", False, f"Status code: {response.status_code}")
                return False
                
            updated_student = response.json()
            if updated_student.get("father_name") != update_father_data["father_name"]:
                self.log_test("Father_name field - Update father_name", False, f"Expected '{update_father_data['father_name']}', got '{updated_student.get('father_name')}'")
                return False
                
            # Test 4: Add father_name to student that didn't have one
            add_father_data = {"father_name": "Carlos Moreno Díaz"}
            response = self.session.put(f"{self.base_url}/students/{student_id_2}", json=add_father_data)
            if response.status_code != 200:
                self.log_test("Father_name field - Add father_name to existing student", False, f"Status code: {response.status_code}")
                return False
                
            updated_student = response.json()
            if updated_student.get("father_name") != add_father_data["father_name"]:
                self.log_test("Father_name field - Add father_name to existing student", False, f"Expected '{add_father_data['father_name']}', got '{updated_student.get('father_name')}'")
                return False
                
            # Test 5: Verify father_name appears in student lists
            response = self.session.get(f"{self.base_url}/students")
            if response.status_code != 200:
                self.log_test("Father_name field - Verify in student list", False, f"Status code: {response.status_code}")
                return False
                
            all_students = response.json()
            test_students = [s for s in all_students if s["id"] in [student_id_1, student_id_2]]
            
            for student in test_students:
                if "father_name" not in student:
                    self.log_test("Father_name field - Verify in student list", False, f"father_name field missing from student {student['first_and_last_name']}")
                    return False
                    
            self.log_test("Father_name field - All scenarios", True, "✅ All father_name field scenarios working correctly: create with/without father_name, update father_name, add father_name to existing student, verify in lists")
            return True
            
        except Exception as e:
            self.log_test("Father_name field - All scenarios", False, f"Exception: {str(e)}")
            return False
            
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test getting non-existent student
            response = self.session.get(f"{self.base_url}/students/non-existent-id")
            if response.status_code != 404:
                self.log_test("Error handling - Non-existent student", False, f"Expected 404, got {response.status_code}")
                return False
                
            # Test updating non-existent student
            response = self.session.put(f"{self.base_url}/students/non-existent-id", json={"mother_name": "Test"})
            if response.status_code != 404:
                self.log_test("Error handling - Update non-existent student", False, f"Expected 404, got {response.status_code}")
                return False
                
            # Test deleting non-existent student
            response = self.session.delete(f"{self.base_url}/students/non-existent-id")
            if response.status_code != 404:
                self.log_test("Error handling - Delete non-existent student", False, f"Expected 404, got {response.status_code}")
                return False
                
            self.log_test("Error handling", True, "All error cases handled correctly")
            return True
            
        except Exception as e:
            self.log_test("Error handling", False, f"Exception: {str(e)}")
            return False
            
    def cleanup_test_data(self):
        """Clean up test data"""
        print("\n🧹 Cleaning up test data...")
        for student_id in self.created_student_ids:
            try:
                self.session.delete(f"{self.base_url}/students/{student_id}")
            except:
                pass  # Ignore cleanup errors
                
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Classes endpoint (database initialization)
        self.test_classes_endpoint()
        
        # Test 2: App settings endpoint
        self.test_app_settings_endpoint()
        
        # Test 3: Create student
        created_student = self.test_create_student()
        
        if created_student:
            student_id = created_student["id"]
            
            # Test 4: Get all students
            self.test_get_all_students()
            
            # Test 5: Get students by class (with sorting)
            self.test_get_students_by_class()
            
            # Test 6: Get single student
            self.test_get_single_student(student_id)
            
            # Test 7: Update student
            self.test_update_student(student_id)
            
            # Test 8: Error handling
            self.test_error_handling()
            
            # Test 9: Delete student (keep one for deletion test)
            if len(self.created_student_ids) > 1:
                self.test_delete_student(self.created_student_ids[-1])
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        # Cleanup
        self.cleanup_test_data()
        
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)