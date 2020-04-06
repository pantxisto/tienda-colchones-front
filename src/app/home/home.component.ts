import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';

declare var M: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = sessionStorage.getItem('role') === 'Admin' && this.router.url !== '/' ? ['nombre', 'tipo', 'precio', 'actions'] : ['nombre', 'tipo', 'precio'];
  //exampleDatabase: ExampleHttpDatabase | null;
  data: any[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isAdmin: boolean;
  isSomier: boolean

  _type: string;
  _favorite: boolean;
  _name: string;
  _prize: string;
  _description: string;
  _imagePath: string;

  uploadForm: FormGroup; 
  
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private apiService: ApiService,
    public router: Router,
    private formBuilder: FormBuilder) {
      this.isAdmin = sessionStorage.getItem('role') === 'Admin' ? true : false;
      this.isSomier = this.router.url === '/somieres' ? true : false;
      this._type = this.router.url === '/colchones' ? 'Colchon' : 'Somier';
      this._favorite = false;
    }

    ngOnInit() {
      this.uploadForm = this.formBuilder.group({
        profile: ['']
      });
    }

    onFileSelect(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.uploadForm.get('profile').setValue(file);
      }
    }

  ngAfterViewInit() {
    // Inicializo el modal
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apiService!.getFavoriteProducts(this.router.url, this.paginator.pageIndex);
        }),
        map(data => {
          console.log(data);
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  deleteProduct(_id) {
    if (confirm('Are you sure you want to delete?')) {
      this.apiService.deleteProduct(_id)
      .subscribe(res => {
        M.toast({ html: 'Producto borrado'});
        this.paginator.page.emit();
      });
    }
  }

  createProduct() {
    // Inicializo el modal
    var elems = document.querySelector('.modal');
    var instance = M.Modal.getInstance(elems);

    instance.open();
  }

  addProduct(form: NgForm) {
    const fileName = this.uploadForm.get('profile').value.name;
    const formData = new FormData();
    formData.append('_id', form.value._id);
    formData.append('name', form.value.name);
    formData.append('type', form.value.type);
    formData.append('prize', form.value.prize);
    formData.append('description', form.value.description);
    formData.append('favorite', form.value.favorite);
    if (fileName) {
      formData.append('imagePath', '/images/' + fileName);
      formData.append('file', this.uploadForm.get('profile').value);
    } else {
      formData.append('imagePath', form.value.imagePath);
    }

    if (isNaN(form.value.prize)) {
      console.log('No es un numero');
      M.toast({ html: 'Introduce un número en el precio'});
    } else {
      var elems = document.querySelector('.modal');
      var instance = M.Modal.getInstance(elems);
      instance.close();

      this.apiService.postProduct(formData)
      .subscribe(res => {
        M.toast({ html: 'Producto creado'});
        this.paginator.page.emit();
      });
      
    }
  }
}

