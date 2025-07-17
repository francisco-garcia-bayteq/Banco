import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class AplicationService {
    private apiBaseUrl: string;
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor() {
        // Usar la ruta del proxy en lugar de la URL completa
        this.apiBaseUrl = '/api';
    }

    getHeaders() {
        return this.headers;
    }

    getApiBaseUrl() {
        return this.apiBaseUrl;
    }
}