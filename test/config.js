const assert = require("assert");
const sinon = require("sinon");
const config = require("../lib/config");
const fs = require("fs");
const program = require("commander");

describe("Config", () => {
  describe("getKey", () => {
    it("Should return the config token if the file exists", () => {
      sinon.stub(fs, "readFileSync").callsFake(() => {
        return "123456";
      });

      const key = config.getKey();

      assert.equal(key, "123456", "Should return the correct key.");

      sinon.restore();
    });

    it("Should return an error is thrown", () => {
      const spy = sinon.spy(config, "getKey");

      try {
        config.getKey();
      } catch (e) {}

      assert(spy.threw());
      sinon.restore();
    });
  });

  describe("getArgs", () => {
    it("Should return an error if no event name is passed", () => {
      sinon
        .mock(console)
        .expects("error")
        .once();

      config.getArgs();

      sinon.restore();
    });

    it("Should return the event name", () => {
      sinon.stub(program, "parse").callsFake(() => {
        program.args = ["myEventName"];
      });

      const args = config.getArgs();

      assert.equal(
        args.event,
        "myEventName",
        "Should correctly return the eventName"
      );
      sinon.restore();
    });

    it("Should return the all form values", () => {
      sinon.stub(program, "parse").callsFake(() => {
        program.args = ["myEventName", "arg1", "arg2", "arg3"];
      });

      const args = config.getArgs();

      assert.deepEqual(
        args,
        {
          event: "myEventName",
          value1: "arg1",
          value2: "arg2",
          value3: "arg3"
        },
        "Should correctly return all the form values."
      );
      sinon.restore();
    });
  });
});
