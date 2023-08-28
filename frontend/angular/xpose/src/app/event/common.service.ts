import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  isUserNearEvent(eventLat: number, eventLon: number, maxDistance: number): Observable<boolean> {
    return this.getLocation().pipe(
      catchError(() => of(false)),
      map(location => {
        if (typeof location === 'boolean') {
          // Handle the case when location is false (error case)
          return false;
        }
  
        // At this point, location is guaranteed to be of type { lat: number; lon: number; }
        const distance = this.calculateDistance(location.lat, location.lon, eventLat, eventLon);
        return distance <= maxDistance;
      })
    );
  }
  
  
  

  getLocation(): Observable<{ lat: number; lon: number }> {
    return new Observable<{ lat: number; lon: number }>((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            observer.next({ lat: userLat, lon: userLon });
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not available.');
      }
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadius = 6371; // in kilometers

  const dLat = this.toRadians(lat2 - lat1);
  const dLon = this.toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRadians(lat1)) *
      Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
  }

  private toRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }
}
