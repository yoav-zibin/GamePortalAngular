import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWrapperComponent } from './group-wrapper.component';

describe('GroupWrapperComponent', () => {
  let component: GroupWrapperComponent;
  let fixture: ComponentFixture<GroupWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
