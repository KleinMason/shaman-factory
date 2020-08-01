import 'mocha';
import * as sinon from 'sinon';
import * as _fsx from 'fs-extra';
import * as _cmd from 'child_process';
import { expect } from 'chai';
import { CreateCommand } from './create.command';

describe('CreateCommand', () => {
  
  var sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('name should be "create"', () => {
    let subject = new CreateCommand();
    expect(subject.name).to.to.equal("create");
  });

  it('run should throw if no name parameter provided', () => {
    let subject = new CreateCommand();
    let msg = "Name parameter not provided to create command.";
    expect(() => subject.run(null)).to.throw(msg);
  });

  it('run should throw if invalid template provided', (done) => {
    sandbox.stub(_fsx, 'readdir').returns(Promise.resolve(["default"]));
    let subject = new CreateCommand();
    subject.run("sample", "invalid").catch(ex => {
      expect(ex.message).to.equal("Invalid template 'invalid'.");
      done();
    });
  });

  it('run should throw if folder already exists', (done) => {
    sandbox.stub(_fsx, 'readdir').returns(Promise.resolve(["default"]));
    sandbox.stub(_fsx, 'pathExists').returns(<any>Promise.resolve(true));
    let subject = new CreateCommand();
    subject.run("sample").catch(ex => {
      expect(ex.message).to.equal("Path already exists.");
      done();
    });
  });

  it('run should copy files', (done) => {
    sandbox.stub(_fsx, 'readdir').returns(Promise.resolve(["default"]));
    sandbox.stub(_fsx, 'pathExists').returns(<any>Promise.resolve(false));
    sandbox.stub(_fsx, 'writeFile').returns(<any>Promise.resolve());
    sandbox.stub(_cmd, 'exec').yields(null, null, null);
    let stub = sandbox.stub(_fsx, 'copy').returns(<any>Promise.resolve());
    let subject = new CreateCommand();
    subject.run("sample").then(_ => {
      expect(stub.called).to.be.true;
      done();
    });
  });

  it('run should create package.json file', (done) => {
    sandbox.stub(_fsx, 'readdir').returns(Promise.resolve(["default"]));
    sandbox.stub(_fsx, 'pathExists').returns(<any>Promise.resolve(false));
    sandbox.stub(_fsx, 'copy').returns(<any>Promise.resolve());
    sandbox.stub(_cmd, 'exec').yields(null, null, null);
    let stub = sandbox.stub(_fsx, 'writeFile').returns(<any>Promise.resolve());
    let subject = new CreateCommand();
    subject.run("sample").then(_ => {
      expect(stub.called).to.be.true;
      done();
    });
  });

  it('run should throw if exec returns exception', (done) => {
    sandbox.stub(_fsx, 'readdir').returns(Promise.resolve(["default"]));
    sandbox.stub(_fsx, 'pathExists').returns(<any>Promise.resolve(false));
    sandbox.stub(_fsx, 'copy').returns(<any>Promise.resolve());
    sandbox.stub(_cmd, 'exec').yields(new Error("test error"), null, null);
    let stub = sandbox.stub(_fsx, 'writeFile').returns(<any>Promise.resolve());
    let subject = new CreateCommand();
    subject.run("sample").catch(() => done());
  });

  it('run should throw if stderr has value', (done) => {
    sandbox.stub(_fsx, 'readdir').returns(Promise.resolve(["default"]));
    sandbox.stub(_fsx, 'pathExists').returns(<any>Promise.resolve(false));
    sandbox.stub(_fsx, 'copy').returns(<any>Promise.resolve());
    sandbox.stub(_cmd, 'exec').yields(null, null, "test error");
    let stub = sandbox.stub(_fsx, 'writeFile').returns(<any>Promise.resolve());
    let subject = new CreateCommand();
    subject.run("sample").catch(() => done());
  });

});