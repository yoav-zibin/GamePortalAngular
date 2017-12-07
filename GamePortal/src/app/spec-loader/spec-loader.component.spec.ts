import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayArenaComponent } from './spec-loader.component';

describe('PlayArenaComponent', () => {
  let component: PlayArenaComponent;
  let fixture: ComponentFixture<PlayArenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayArenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
