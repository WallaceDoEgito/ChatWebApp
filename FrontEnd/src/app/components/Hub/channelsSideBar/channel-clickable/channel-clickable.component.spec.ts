import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelClickableComponent } from './channel-clickable.component';

describe('ChannelClickableComponent', () => {
  let component: ChannelClickableComponent;
  let fixture: ComponentFixture<ChannelClickableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelClickableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelClickableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
