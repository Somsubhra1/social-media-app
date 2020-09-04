import { Component, OnInit } from '@angular/core';

// Toastr
import { ToastrService } from 'ngx-toastr';

// Router
import { Router } from '@angular/router';

// Auth service
import { AuthService } from '../../services/auth.service';

// Form
import { NgForm } from '@angular/forms';

// Rxjs
import { finalize } from 'rxjs/operators';

// Firebase
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

// image resizer
import { readAndCompressImage } from 'browser-image-resizer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  picture =
    'https://learnyst.s3.amazonaws.com/assets/schools/2410/resources/images/logo_lco_i3oab.png';

  uploadPercent: number = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const { email, password, username, country, bio, name } = f.form.value;

    // Sanitize form data here

    this.auth
      .signUp(email, password)
      .then((res) => {
        console.log(res);
        const { uid } = res.user;

        this.db.object(`/users/${uid}`).set({
          id: uid,
          name,
          email,
          instaUserName: username,
          country,
          bio,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('SignUp Success');
      })
      .catch((err) => {
        this.toastr.error('SignUp failed');
      });
  }
}
