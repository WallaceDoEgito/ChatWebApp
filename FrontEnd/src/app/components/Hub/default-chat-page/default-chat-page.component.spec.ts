import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultChatPageComponent } from './default-chat-page.component';

describe('DefaultChatPageComponent', () => {
  let component: DefaultChatPageComponent;
  let fixture: ComponentFixture<DefaultChatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultChatPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
