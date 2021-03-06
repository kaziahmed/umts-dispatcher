import { Shift } from './shift';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';


@Injectable()
export class ShiftService {
  private socket;

  connect() {
    this.socket = io();
  }

  addShift(startTime, endTime, startLoc, endLoc, route, driverID, busID): void {
    if (!driverID) {
      driverID = -1;
    }
    this.socket.emit('addShift', {
      startTime: startTime,
      endTime: endTime,
      startLoc: startLoc,
      endLoc: endLoc,
      route: route,
      driverID: driverID,
      busID: busID
    });
  }

  editShift(shift: Shift) {
    this.socket.emit('editShift', {
      id: shift.id,
      startTime: shift.startDate + "T" + shift.startTime + ":00.000Z",
      endTime: shift.endDate + "T" + shift.endTime + ":00.000Z",
      startLoc: shift.startLocation,
      endLoc: shift.endLocation,
      route: shift.route,
      driverID: shift.driverID,
      busID: shift.busID
    });
  }

  getShiftByDay(date) {
    this.socket.emit('getShiftByDay', date);
  }

  getDriversAvailable(start, end) {
    this.socket.emit('driversAvailable', {startTime: start, endTime: end});
  }

  // This will always load the shifts that have been requested.
  // For this data to be updated, a message needs to be sent to the socket
  getShifts() {
    let observable = new Observable(observer => {
      this.socket.on('update shifts', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  // Observer for updating list of drivers as dates change in form
  getDrivers() {
    let observable = new Observable(observer => {
      this.socket.on('update available drivers', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
