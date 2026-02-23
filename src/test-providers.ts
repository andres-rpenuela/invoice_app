import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

const testProviders = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideZonelessChangeDetection()
];


export default testProviders;
