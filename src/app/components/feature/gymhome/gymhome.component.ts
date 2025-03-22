import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gymhome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gymhome.component.html',
  styleUrls: ['./gymhome.component.scss'],
})
export class GymhomeComponent {
  error: string = '';
  gymname: string = '';
  gymid!: string;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.auth.getLocalGymName().then((resp: any) => {
      if (resp !== null) {
        this.gymname = resp;
        this.router.navigate(['gymhome'], { relativeTo: this.route });
      } else {
        alert('Required information not found! Please login...');
        this.router.navigate(['../gymlogin'], { relativeTo: this.route });
      }

      console.log(this.gymname);
    });

    this.auth.getLocalGymkey().then((resp: any) => {
      this.gymid = resp;
      console.log(this.gymid);
    });
  }
}
