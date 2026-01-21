// Backend Session Validation Utility
// This would typically be used in your backend/server-side code

export interface DescopeValidationResult {
  isValid: boolean;
  user?: {
    userId: string;
    email: string;
    name: string;
    [key: string]: any;
  };
  error?: string;
}

// Frontend helper to get session token
export const getDescopeSessionToken = (): string | null => {
  try {
    // Get the session token from localStorage (where Descope stores it)
    const sessionToken = localStorage.getItem('DS');
    return sessionToken;
  } catch (error) {
    console.error('Error getting Descope session token:', error);
    return null;
  }
};

// Example function for backend validation (Node.js/Express example)
export const validateDescopeSessionExample = `
// Backend validation example (Node.js)
// Install: npm install @descope/node-sdk

const DescopeClient = require('@descope/node-sdk').default;

// Initialize Descope client with your project ID
const descopeClient = DescopeClient({
  projectId: 'P37vaF398AxQbhS7fFW2mrNIKO0i'
});

// Middleware to validate session
const validateDescopeSession = async (req, res, next) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    // Validate the session token
    const authInfo = await descopeClient.validateSession(sessionToken);
    
    if (authInfo.valid) {
      // Session is valid, attach user info to request
      req.user = {
        userId: authInfo.token.sub,
        email: authInfo.token.email,
        name: authInfo.token.name,
        // Add other user properties as needed
      };
      next();
    } else {
      return res.status(401).json({ error: 'Invalid session token' });
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(401).json({ error: 'Session validation failed' });
  }
};

// Usage in your routes
app.get('/api/protected-route', validateDescopeSession, (req, res) => {
  res.json({ 
    message: 'Access granted',
    user: req.user 
  });
});

// For Go backend (as mentioned in your request)
/*
package main

import (
    "context"
    "log"
    "net/http"
    
    "github.com/descope/go-sdk/descope"
    "github.com/descope/go-sdk/descope/client"
)

func main() {
    // Initialize Descope client
    descopeClient, err := client.New(
        client.WithProjectID("P37vaF398AxQbhS7fFW2mrNIKO0i"),
    )
    if err != nil {
        log.Fatal("Failed to initialize Descope client:", err)
    }

    // Middleware for session validation
    validateSession := func(next http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
            sessionToken := r.Header.Get("Authorization")
            if sessionToken == "" {
                http.Error(w, "No session token provided", http.StatusUnauthorized)
                return
            }

            // Remove "Bearer " prefix if present
            if len(sessionToken) > 7 && sessionToken[:7] == "Bearer " {
                sessionToken = sessionToken[7:]
            }

            // Validate session
            authorized, userToken, err := descopeClient.Auth.ValidateSessionWithToken(
                context.Background(), 
                sessionToken,
            )
            
            if err != nil || !authorized {
                http.Error(w, "Invalid session token", http.StatusUnauthorized)
                return
            }

            // Add user info to context or request
            // You can access userToken.Claims for user information
            log.Printf("User authenticated: %s", userToken.Claims["email"])
            
            next(w, r)
        }
    }

    // Protected route example
    http.HandleFunc("/api/protected", validateSession(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte({"message": "Access granted"}))
    }))

    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
*/
`;

// Frontend helper to make authenticated requests
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const sessionToken = getDescopeSessionToken();
  
  if (!sessionToken) {
    throw new Error('No session token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired or invalid, redirect to login
    window.location.href = '/auth';
    throw new Error('Session expired');
  }

  return response;
};

// Example usage in your components
export const exampleUsage = `
// In your React component
import { makeAuthenticatedRequest } from '@/utils/descopeValidation';

const MyComponent = () => {
  const handleProtectedAction = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ serviceId: '123' })
      });
      
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleProtectedAction}>
      Make Protected Request
    </button>
  );
};
`;