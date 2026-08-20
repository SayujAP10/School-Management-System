import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  // Clone the request to add the new header
  if (token) {
    const authReq = req.clone({
     setHeaders:{
      Authorization: `Bearer ${token}`
     }
    });
    // Pass the cloned request instead of the original request to the next handle
    return next(authReq);
  }
  return next(req);
};
