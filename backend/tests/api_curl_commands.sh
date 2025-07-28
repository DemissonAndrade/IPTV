#!/bin/bash

# Test /api/vod routes
echo "Testing /api/vod/featured"
curl -X GET http://localhost:3000/api/vod/featured
echo -e "\\n"

echo "Testing /api/vod/movies"
curl -X GET http://localhost:3000/api/vod/movies
echo -e "\\n"

echo "Testing /api/vod/movies/:id (replace with actual movie id)"
curl -X GET http://localhost:3000/api/vod/movies/1
echo -e "\\n"

echo "Testing /api/vod/movies/:id/stream (replace with actual movie id)"
curl -X GET http://localhost:3000/api/vod/movies/1/stream
echo -e "\\n"

echo "Testing /api/vod/series"
curl -X GET http://localhost:3000/api/vod/series
echo -e "\\n"

echo "Testing /api/vod/series/:id (replace with actual series id)"
curl -X GET http://localhost:3000/api/vod/series/1
echo -e "\\n"

echo "Testing /api/vod/series/:id/stream (replace with actual series id)"
curl -X GET http://localhost:3000/api/vod/series/1/stream
echo -e "\\n"

# Test /api/plans routes
echo "Testing /api/plans"
curl -X GET http://localhost:3000/api/plans
echo -e "\\n"

echo "Testing /api/plans/:id (replace with actual plan id)"
curl -X GET http://localhost:3000/api/plans/1
echo -e "\\n"

# Test /api/channels routes
echo "Testing /api/channels"
curl -X GET http://localhost:3000/api/channels
echo -e "\\n"

echo "Testing /api/channels/:id"
curl -X GET http://localhost:3000/api/channels/1
echo -e "\\n"

echo "Testing /api/channels/:id/stream (requires auth and active subscription)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/channels/favorites/list (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

# Test /api/epg routes (all require authentication)
echo "Testing /api/epg (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/epg/now (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/epg/next (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/epg/category/:categoria (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/epg/program/:id (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/epg/categories (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

# Test /api/auth routes
echo "Testing /api/auth/register"
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"nome":"testuser","email":"testuser@example.com","senha":"password123"}'
echo -e "\\n"

echo "Testing /api/auth/login"
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"testuser@example.com","senha":"password123"}'
echo -e "\\n"

echo "Testing /api/auth/verify (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/auth/logout (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

# Test /api/users routes (all require authentication)
echo "Testing /api/users/profile (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/users/profile PUT (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/users/password PUT (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/users/favorites (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/users/history (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

echo "Testing /api/users/devices/:sessionId DELETE (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

# Test /api/categories routes
echo "Testing /api/categories"
curl -X GET http://localhost:3000/api/categories
echo -e "\\n"

echo "Testing /api/categories/:id"
curl -X GET http://localhost:3000/api/categories/1
echo -e "\\n"

echo "Testing /api/categories/:id/channels (requires auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"

# Test /api/admin routes (all require admin auth)
echo "Testing /api/admin/dashboard (requires admin auth)"
echo "Skipping actual request for authenticated route"
echo -e "\\n"
