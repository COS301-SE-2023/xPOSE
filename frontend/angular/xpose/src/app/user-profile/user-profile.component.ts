import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { Service } from '../service/service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent  implements OnInit {

  constructor(public authService: AuthService,
    public userService: Service) { }

  ngOnInit() {}

}
