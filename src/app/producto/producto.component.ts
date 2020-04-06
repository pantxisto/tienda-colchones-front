import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

declare var M: any;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.less']
})
export class ProductoComponent implements OnInit, OnDestroy, AfterViewInit {
  id: string;
  private sub: Subscription;
  product: any;
  updatedProduct: any;
  isAdmin: boolean;
  URI: string;
  uploadForm: FormGroup; 

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder) { 
      this.isAdmin = sessionStorage.getItem('role') === 'Admin' ? true : false;
      this.updatedProduct = {};
      this.URI = environment.URI;
    }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.apiService.getProduct(params['id'])
        .subscribe(res => {
          this.product = res;
          this.updatedProduct._id = res['_id'];
          this.updatedProduct.name = res['name'];
          this.updatedProduct.type = res['type'];
          this.updatedProduct.imagePath = res['imagePath'];
          this.updatedProduct.prize = res['prize'];
          this.updatedProduct.description = res['description'];
          this.updatedProduct.favorite = res['favorite'];
        });
   });

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
  }

  deleteProduct(_id) {
    if (confirm('Are you sure you want to delete?')) {
      this.apiService.deleteProduct(this.id)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
    }
  }

  editProduct() {
    // Inicializo el modal
    var elems = document.querySelector('.modal');
    var instance = M.Modal.getInstance(elems);

    instance.open();
  }
  
  updateProduct(form: NgForm) {
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

      this.apiService.putProduct(this.id, formData)
      .subscribe(res => {
        M.toast({ html: 'Producto actualizado'});

        this.apiService.getProduct(this.id)
          .subscribe(res => {
            this.product = res;
            this.updatedProduct._id = res['_id'];
            this.updatedProduct.name = res['name'];
            this.updatedProduct.type = res['type'];
            this.updatedProduct.imagePath = res['imagePath'];
            this.updatedProduct.prize = res['prize'];
            this.updatedProduct.description = res['description'];
            this.updatedProduct.favorite = res['favorite'];
          });
      });
      
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
