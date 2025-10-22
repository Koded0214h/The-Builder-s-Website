#!/usr/bin/env python3
"""
Rapid Scaffolder API Test Script
Standalone script to test the complete control flow with JWT authentication
"""

import requests
import json
import uuid
import sys
from typing import Dict, Any, List

# Configuration
BASE_URL = "http://localhost:8000/api"
AUTH_URL = "http://localhost:8000/api/auth"

class RapidScaffolderTester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.user_data = None
        self.test_project_id = None
        self.test_model_ids = []
        
    def print_step(self, message: str):
        """Print formatted step message"""
        print(f"\n{'='*60}")
        print(f"STEP: {message}")
        print(f"{'='*60}")
    
    def print_success(self, message: str):
        """Print success message"""
        print(f"✅ SUCCESS: {message}")
    
    def print_error(self, message: str):
        """Print error message"""
        print(f"❌ ERROR: {message}")
    
    def print_info(self, message: str):
        """Print info message"""
        print(f"ℹ️  INFO: {message}")
    
    def make_authenticated_request(self, method: str, url: str, **kwargs) -> requests.Response:
        """Make request with JWT token"""
        headers = kwargs.get('headers', {})
        if self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        kwargs['headers'] = headers
        return self.session.request(method, url, **kwargs)
    
    def test_authentication(self) -> bool:
        """Test user registration and authentication"""
        self.print_step("1. Testing Authentication Flow")
        
        # Generate unique test user data
        test_id = str(uuid.uuid4())[:8]
        user_data = {
            "username": f"testuser_{test_id}",
            "email": f"test_{test_id}@example.com",
            "password": "testpassword123",
            "password2": "testpassword123",
            "first_name": "Test",
            "last_name": f"User_{test_id}"
        }
        
        # Test Registration
        self.print_info("Testing user registration...")
        try:
            response = self.session.post(f"{AUTH_URL}/register/", json=user_data)
            if response.status_code == 201:
                self.user_data = response.json()['user']
                self.access_token = response.json()['access']
                self.print_success(f"User registered: {self.user_data['username']}")
                self.print_info(f"Access Token: {self.access_token[:50]}...")
            else:
                self.print_error(f"Registration failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Registration request failed: {e}")
            return False
        
        # Test Login with same credentials
        self.print_info("Testing user login...")
        login_data = {
            "username": user_data["username"],
            "password": user_data["password"]
        }
        
        try:
            response = self.session.post(f"{AUTH_URL}/login/", json=login_data)
            if response.status_code == 200:
                new_token = response.json()['access']
                self.print_success("Login successful")
                self.print_info(f"New Token: {new_token[:50]}...")
            else:
                self.print_error(f"Login failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Login request failed: {e}")
        
        # Test Profile Access
        self.print_info("Testing profile access...")
        try:
            response = self.make_authenticated_request('GET', f"{AUTH_URL}/profile/")
            if response.status_code == 200:
                profile = response.json()
                self.print_success(f"Profile accessed: {profile['username']}")
            else:
                self.print_error(f"Profile access failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Profile request failed: {e}")
            return False
        
        return True
    
    def test_projects_crud(self) -> bool:
        """Test Projects CRUD operations"""
        self.print_step("2. Testing Projects CRUD Operations")
        
        # Create a new project
        project_data = {
            "name": f"Test Project {uuid.uuid4().hex[:8]}",
            "description": "This is a test project created by the automated test script",
            "framework": "django",
            "include_docker": True,
            "include_cors": True,
            "include_rate_limiting": False,
            "include_logging": True,
            "include_env_example": True
        }
        
        self.print_info("Creating new project...")
        try:
            response = self.make_authenticated_request('POST', f"{BASE_URL}/projects/", json=project_data)
            if response.status_code == 201:
                project = response.json()
                self.test_project_id = project['id']
                self.print_success(f"Project created: {project['name']} (ID: {self.test_project_id})")
            else:
                self.print_error(f"Project creation failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Project creation request failed: {e}")
            return False
        
        # List projects
        self.print_info("Listing all projects...")
        try:
            response = self.make_authenticated_request('GET', f"{BASE_URL}/projects/")
            if response.status_code == 200:
                projects = response.json()['results']
                self.print_success(f"Found {len(projects)} project(s)")
                for p in projects:
                    self.print_info(f" - {p['name']} ({p['framework']})")
            else:
                self.print_error(f"Projects list failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Projects list request failed: {e}")
        
        # Get project details
        self.print_info("Getting project details...")
        try:
            response = self.make_authenticated_request('GET', f"{BASE_URL}/projects/{self.test_project_id}/")
            if response.status_code == 200:
                project = response.json()
                self.print_success(f"Project details retrieved: {project['name']}")
                self.print_info(f" - Framework: {project['framework']}")
                self.print_info(f" - Models: {len(project.get('database_models', []))}")
            else:
                self.print_error(f"Project details failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Project details request failed: {e}")
        
        return True
    
    def test_database_models(self) -> bool:
        """Test Database Models CRUD operations"""
        self.print_step("3. Testing Database Models Operations")
        
        if not self.test_project_id:
            self.print_error("No project ID available. Run projects test first.")
            return False
        
        # Create first model: UserProfile
        user_profile_data = {
            "name": "UserProfile",
            "description": "Extended user profile information",
            "display_field": "user",
            "order": 1,
            "project": self.test_project_id  # ← ADDED
        }
        
        self.print_info("Creating UserProfile model...")
        try:
            response = self.make_authenticated_request(
                'POST', 
                f"{BASE_URL}/projects/{self.test_project_id}/models/", 
                json=user_profile_data
            )
            if response.status_code == 201:
                model = response.json()
                user_profile_id = model['id']
                self.test_model_ids.append(user_profile_id)
                self.print_success(f"Model created: {model['name']} (ID: {user_profile_id})")
            else:
                self.print_error(f"Model creation failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Model creation request failed: {e}")
            return False
        
        # Create second model: BlogPost
        blog_post_data = {
            "name": "BlogPost",
            "description": "Blog post with title and content",
            "display_field": "title",
            "order": 2,
            "project": self.test_project_id  # ← ADDED
        }
        
        self.print_info("Creating BlogPost model...")
        try:
            response = self.make_authenticated_request(
                'POST', 
                f"{BASE_URL}/projects/{self.test_project_id}/models/", 
                json=blog_post_data
            )
            if response.status_code == 201:
                model = response.json()
                blog_post_id = model['id']
                self.test_model_ids.append(blog_post_id)
                self.print_success(f"Model created: {model['name']} (ID: {blog_post_id})")
            else:
                self.print_error(f"Model creation failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Model creation request failed: {e}")
            return False
        
        # List models for the project
        self.print_info("Listing all models for project...")
        try:
            response = self.make_authenticated_request(
                'GET', 
                f"{BASE_URL}/projects/{self.test_project_id}/models/"
            )
            if response.status_code == 200:
                models = response.json()['results']
                self.print_success(f"Found {len(models)} model(s) in project")
                for m in models:
                    self.print_info(f" - {m['name']}: {m['description']}")
            else:
                self.print_error(f"Models list failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Models list request failed: {e}")
        
        return True
    
    def test_model_fields(self) -> bool:
        """Test Model Fields CRUD operations"""
        self.print_step("4. Testing Model Fields Operations")
        
        if not self.test_model_ids:
            self.print_error("No model IDs available. Run models test first.")
            return False
        
        user_profile_id = self.test_model_ids[0]
        
        # Add fields to UserProfile model
        fields_data = [
            {
                "name": "bio",
                "field_type": "text",
                "max_length": 500,
                "null": True,
                "blank": True,
                "help_text": "User biography"
            },
            {
                "name": "website",
                "field_type": "url",
                "max_length": 200,
                "null": True,
                "blank": True,
                "help_text": "Personal website URL"
            },
            {
                "name": "birth_date",
                "field_type": "date",
                "null": True,
                "blank": True
            }
        ]
        
        for field_data in fields_data:
            self.print_info(f"Adding field '{field_data['name']}' to UserProfile...")
            try:
                response = self.make_authenticated_request(
                    'POST', 
                    f"{BASE_URL}/projects/{self.test_project_id}/models/{user_profile_id}/fields/", 
                    json=field_data
                )
                if response.status_code == 201:
                    field = response.json()
                    self.print_success(f"Field created: {field['name']} ({field['field_type']})")
                else:
                    self.print_error(f"Field creation failed: {response.status_code} - {response.text}")
            except Exception as e:
                self.print_error(f"Field creation request failed: {e}")
        
        # List fields for the model
        self.print_info("Listing all fields for UserProfile model...")
        try:
            response = self.make_authenticated_request(
                'GET', 
                f"{BASE_URL}/projects/{self.test_project_id}/models/{user_profile_id}/fields/"
            )
            if response.status_code == 200:
                fields = response.json()['results']
                self.print_success(f"Found {len(fields)} field(s) in UserProfile")
                for f in fields:
                    self.print_info(f" - {f['name']}: {f['field_type']} (null: {f['null']}, blank: {f['blank']})")
            else:
                self.print_error(f"Fields list failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Fields list request failed: {e}")
        
        return True
    
    def test_relationships(self) -> bool:
        """Test Relationships between models"""
        self.print_step("5. Testing Model Relationships")
        
        if len(self.test_model_ids) < 2:
            self.print_error("Need at least 2 models for relationships test.")
            return False
        
        user_profile_id, blog_post_id = self.test_model_ids[0], self.test_model_ids[1]
        
        # Create a relationship: BlogPost has a foreign key to UserProfile
        relationship_data = {
            "from_model": blog_post_id,
            "to_model": user_profile_id,
            "relationship_type": "foreign_key",
            "name": "author",
            "on_delete": "cascade",
            "related_name": "blog_posts",
            "null": False,
            "blank": False
        }
        
        self.print_info("Creating relationship: BlogPost.author -> UserProfile...")
        try:
            response = self.make_authenticated_request(
                'POST', 
                f"{BASE_URL}/projects/{self.test_project_id}/relationships/", 
                json=relationship_data
            )
            if response.status_code == 201:
                relationship = response.json()
                self.print_success(f"Relationship created: {relationship['name']} ({relationship['relationship_type']})")
                self.print_info(f" - From: {relationship['from_model_name']}")
                self.print_info(f" - To: {relationship['to_model_name']}")
                self.print_info(f" - On Delete: {relationship['on_delete']}")
            else:
                self.print_error(f"Relationship creation failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Relationship creation request failed: {e}")
            return False
        
        # List relationships
        self.print_info("Listing all relationships for project...")
        try:
            response = self.make_authenticated_request(
                'GET', 
                f"{BASE_URL}/projects/{self.test_project_id}/relationships/"
            )
            if response.status_code == 200:
                relationships = response.json()['results']
                self.print_success(f"Found {len(relationships)} relationship(s)")
                for rel in relationships:
                    self.print_info(f" - {rel['from_model_name']}.{rel['name']} -> {rel['to_model_name']}")
            else:
                self.print_error(f"Relationships list failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Relationships list request failed: {e}")
        
        return True
    
    def test_code_generation(self) -> bool:
        """Test code generation endpoints"""
        self.print_step("6. Testing Code Generation")
        
        if not self.test_project_id:
            self.print_error("No project ID available.")
            return False
        
        # Test code preview
        self.print_info("Testing code preview...")
        try:
            response = self.make_authenticated_request(
                'GET', 
                f"{BASE_URL}/projects/{self.test_project_id}/preview/"
            )
            if response.status_code == 200:
                preview = response.json()
                self.print_success("Code preview generated successfully")
                # Just show that we got a response, don't print the actual code
            elif response.status_code == 501:
                self.print_info("Code preview is temporarily disabled (expected)")
            else:
                self.print_error(f"Code preview failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Code preview request failed: {e}")
        
        # Test code generation (download)
        self.print_info("Testing code generation (download)...")
        try:
            response = self.make_authenticated_request(
                'POST', 
                f"{BASE_URL}/projects/{self.test_project_id}/generate/"
            )
            if response.status_code == 200:
                self.print_success("Code generation successful - ZIP file would be downloaded")
            elif response.status_code == 501:
                self.print_info("Code generation is temporarily disabled (expected)")
            else:
                self.print_error(f"Code generation failed: {response.status_code} - {response.text}")
        except Exception as e:
            self.print_error(f"Code generation request failed: {e}")
        
        return True
    
    def cleanup(self):
        """Clean up test data"""
        self.print_step("7. Cleaning Up Test Data")
        
        if self.test_project_id:
            self.print_info("Deleting test project...")
            try:
                response = self.make_authenticated_request(
                    'DELETE', 
                    f"{BASE_URL}/projects/{self.test_project_id}/"
                )
                if response.status_code in [200, 204]:
                    self.print_success("Test project deleted")
                else:
                    self.print_error(f"Project deletion failed: {response.status_code} - {response.text}")
            except Exception as e:
                self.print_error(f"Project deletion request failed: {e}")
    
    def run_full_test(self):
        """Run the complete test suite"""
        self.print_step("🚀 STARTING RAPID SCAFFOLDER API TESTS")
        
        tests = [
            ("Authentication", self.test_authentication),
            ("Projects CRUD", self.test_projects_crud),
            ("Database Models", self.test_database_models),
            ("Model Fields", self.test_model_fields),
            ("Relationships", self.test_relationships),
            ("Code Generation", self.test_code_generation),
        ]
        
        results = []
        for test_name, test_func in tests:
            try:
                success = test_func()
                results.append((test_name, success))
                if not success:
                    self.print_error(f"Test '{test_name}' failed. Stopping test suite.")
                    break
            except Exception as e:
                self.print_error(f"Test '{test_name}' crashed: {e}")
                results.append((test_name, False))
                break
        
        # Print summary
        self.print_step("📊 TEST SUMMARY")
        passed = sum(1 for _, success in results if success)
        total = len(results)
        
        for test_name, success in results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"  {status}: {test_name}")
        
        print(f"\n🎯 Results: {passed}/{total} tests passed")
        
        if passed == total:
            self.print_success("All tests completed successfully! 🎉")
        else:
            self.print_error("Some tests failed. Check the logs above.")
        
        # Cleanup
        self.cleanup()
        
        return passed == total

def main():
    """Main function to run the tests"""
    tester = RapidScaffolderTester()
    
    try:
        success = tester.run_full_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        tester.cleanup()
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()