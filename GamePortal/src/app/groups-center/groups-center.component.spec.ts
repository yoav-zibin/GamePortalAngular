import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsCenterComponent } from './groups-center.component';

describe('GroupsCenterComponent', () => {
  let component: GroupsCenterComponent;
  let fixture: ComponentFixture<GroupsCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
