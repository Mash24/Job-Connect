# Performance Optimization Guide

A comprehensive guide for optimizing the performance of the Job Connect application. This guide covers various optimization techniques, best practices, and implementation details.

## Table of Contents

1. [Code Splitting](#code-splitting)
2. [Caching Strategy](#caching-strategy)
3. [Bundle Optimization](#bundle-optimization)
4. [Image Optimization](#image-optimization)
5. [Service Worker](#service-worker)
6. [Performance Monitoring](#performance-monitoring)
7. [Best Practices](#best-practices)

## Code Splitting

### Route-based Code Splitting

```javascript
// src/routes/index.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from 'src/components/common/LoadingSpinner';

const Home = lazy(() => import('src/pages/Home'));
const Jobs = lazy(() => import('src/pages/Jobs'));
const Profile = lazy(() => import('src/pages/Profile'));
const Settings = lazy(() => import('src/pages/Settings'));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Component-based Code Splitting

```javascript
// src/components/JobDetails.jsx
import { lazy, Suspense } from 'react';
import LoadingSpinner from 'src/components/common/LoadingSpinner';

const JobDescription = lazy(() => import('./JobDescription'));
const CompanyInfo = lazy(() => import('./CompanyInfo'));
const ApplicationForm = lazy(() => import('./ApplicationForm'));

function JobDetails({ job }) {
  return (
    <div className="job-details">
      <Suspense fallback={<LoadingSpinner />}>
        <JobDescription description={job.description} />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyInfo company={job.company} />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <ApplicationForm jobId={job.id} />
      </Suspense>
    </div>
  );
}
```

## Caching Strategy

### React Query Implementation

```javascript
// src/hooks/useJobs.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from 'src/api/jobs';

export function useJobs(filters = {}) {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  const { mutate: applyForJob } = useMutation({
    mutationFn: (jobId) => jobsApi.applyForJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      queryClient.invalidateQueries(['applications']);
    },
  });

  return { jobs, isLoading, error, applyForJob };
}
```

### SWR Implementation

```javascript
// src/hooks/useUser.js
import useSWR from 'swr';
import { userApi } from 'src/api/user';

export function useUser(userId) {
  const { data: user, error, mutate } = useSWR(
    ['user', userId],
    () => userApi.getUser(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  const updateUser = async (updates) => {
    const updatedUser = await userApi.updateUser(userId, updates);
    mutate(updatedUser, false); // Optimistic update
    return updatedUser;
  };

  return { user, error, updateUser };
}
```

## Bundle Optimization

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          utils: ['date-fns', 'lodash-es'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Tree Shaking

```javascript
// src/utils/index.js
export { formatDate } from './date';
export { formatCurrency } from './currency';
export { validateEmail } from './validation';

// Instead of:
// import * as utils from './utils';
// Use:
import { formatDate, formatCurrency } from './utils';
```

## Image Optimization

### Image Component

```javascript
// src/components/common/OptimizedImage.jsx
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

function OptimizedImage({ src, alt, width, height, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [inView, src]);

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        position: 'relative',
      }}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          {...props}
        />
      )}
    </div>
  );
}
```

## Service Worker

### Service Worker Registration

```javascript
// src/serviceWorker.js
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}
```

### Service Worker Implementation

```javascript
// public/service-worker.js
const CACHE_NAME = 'job-connect-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
```

## Performance Monitoring

### Performance Metrics

```javascript
// src/hooks/usePerformanceMonitor.js
import { useEffect } from 'react';

export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const metrics = {
      componentName,
      mountTime: performance.now(),
      renderCount: 0,
    };

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });

    return () => {
      observer.disconnect();
      const unmountTime = performance.now();
      console.log(`${componentName} metrics:`, {
        ...metrics,
        totalTime: unmountTime - metrics.mountTime,
      });
    };
  }, [componentName]);
}
```

## Best Practices

1. **Code Splitting**
   - Use dynamic imports for large components
   - Implement Suspense boundaries
   - Split routes and features

2. **Caching**
   - Use React Query or SWR for data caching
   - Implement optimistic updates
   - Configure appropriate stale times

3. **Bundle Size**
   - Analyze bundle size regularly
   - Use tree shaking
   - Implement code splitting
   - Optimize dependencies

4. **Images**
   - Use lazy loading
   - Implement responsive images
   - Optimize image formats
   - Use appropriate sizing

5. **Service Worker**
   - Cache static assets
   - Implement offline support
   - Handle updates properly

6. **Monitoring**
   - Track performance metrics
   - Monitor bundle size
   - Analyze user experience
   - Set up error tracking

## Contributing

When contributing to performance optimizations, please ensure:

1. Changes are properly documented
2. Performance impact is measured
3. Tests are updated
4. Code follows the project's style guide

## License

This performance optimization guide is part of the job-connect project and is subject to its license terms. 