import { TestBed } from '@angular/core/testing';

import { SecurityService } from './security.service';

describe('SecurityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    setupLocalStorage();
  });

  it('should be created', () => {
    const service: SecurityService = TestBed.get(SecurityService);
    expect(service).toBeTruthy();
  });

  it('user can login', async () => {
    const service: SecurityService = TestBed.get(SecurityService);

    let result = await service.login({ userName: "test", password: "nevermind" }).toPromise();
    expect(result.isAuthenticated).toBeTruthy();
  });

  it('login successfully should set localStorage', async () => {
    const service: SecurityService = TestBed.get(SecurityService);
    await service.login({ userName: "test", password: "nevermind" }).toPromise();
    expect(localStorage.getItem("bearerToken")).not.toBeNull();
  });
});

function setupLocalStorage() {
  let store = {};
  spyOn(localStorage, 'getItem').and.callFake(key => key in store ? store[key] : null);
  spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = `${value}`);
  spyOn(localStorage, 'removeItem').and.callFake(key => delete store[key]);
  spyOn(localStorage, 'clear').and.callFake(() => store = {});
}
