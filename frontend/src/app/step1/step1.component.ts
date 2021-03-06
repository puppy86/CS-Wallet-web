import {Component, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {DataService} from "../data.service";


@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {

  step : number = 1;

  privateKey:  string = "";

  addressKey: string = "";

  prevStep : number = 0;

  isShowPass: boolean = false;

  constructor(public dataService: DataService) { }

  public mouseup() {
    this.isShowPass = false;
  }

  public mousedown() {
    this.isShowPass = true;
  }

  ngOnInit() {

    this.dataService.prevStepObservable.subscribe(

      prevStep =>
      {
        this.prevStep = prevStep;

        if(this.prevStep == 55) {

          window.scrollTo(0, 0);

        }
      }

    )

    };


  @Output() changeStepEvent = new EventEmitter<number>();

   public goToStep(step : number) {

/*
Generating public, private keys for wallets and signing transactions using EdDSA (Ed25519) algorithm in Wallet-Web
a library is used to generate keys https://github.com/dchest/tweetnacl-js
The required result is a signature signed with a secret key
The means to achieve the goal: Public and private key that was generated by the library
The message string collected from the parameters to generate the transaction
 */

       let nacl = require('tweetnacl');

       let signPair = nacl.sign.keyPair();

       
	   //The transition from base64 to base 58
       let  Base58 = require('base-58');

       this.addressKey = Base58.encode(signPair.publicKey);

       this.privateKey = Base58.encode(signPair.secretKey);

      this.dataService.changedPrivateKeyAr(signPair.secretKey);

      this.dataService.changedPublicKeyAr(signPair.publicKey);

      this.dataService.changePrivateKey(this.privateKey);

      this.dataService.changedAressKey(this.addressKey);

      this.dataService.prevStep = 1;

    this.changeStepEvent.emit(step);


  }

  private goToPrevStep() {

    this.changeStepEvent.emit(this.dataService.prevStep);
  }

     //The method is created for the specified task
  uint8arrayToStringMethod(myUint8Arr) {

    return String.fromCharCode.apply(null, myUint8Arr);
  }

}
