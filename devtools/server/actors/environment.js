/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { Actor } = require("resource://devtools/shared/protocol.js");
const {
  environmentSpec,
} = require("resource://devtools/shared/specs/environment.js");

/**
 * Creates an EnvironmentActor. EnvironmentActors are responsible for listing
 * the bindings introduced by a lexical environment and assigning new values to
 * those identifier bindings.
 *
 * @param Debugger.Environment aEnvironment
 *        The lexical environment that will be used to create the actor.
 * @param ThreadActor aThreadActor
 *        The parent thread actor that contains this environment.
 */
class EnvironmentActor extends Actor {
  constructor(environment, threadActor) {
    super(threadActor.conn, environmentSpec);

    this.obj = environment;
    this.threadActor = threadActor;
  }

  /**
   * When the Environment Actor is destroyed it removes the
   * Debugger.Environment.actor field so that environment does not
   * reference a destroyed actor.
   */
  destroy() {
    this.obj.actor = null;
    super.destroy();
  }

  /**
   * Return an environment form for use in a protocol message.
   */
  form() {
    const form = { actor: this.actorID };

    // What is this environment's type?
    if (this.obj.type == "declarative") {
      form.type = this.obj.calleeScript ? "function" : "block";
    } else {
      form.type = this.obj.type;
    }

    form.scopeKind = this.obj.scopeKind;

    // Does this environment have a parent?
    if (this.obj.parent) {
      form.parent = this.threadActor
        .createEnvironmentActor(this.obj.parent, this.threadActor)
        .form();
    }

    // Does this environment reflect the properties of an object as variables?
    if (this.obj.type == "object" || this.obj.type == "with") {
      form.object = this.threadActor.createValueGrip(this.obj.object);
    }

    // Is this the environment created for a function call?
    if (this.obj.calleeScript) {
      // Client only uses "displayName" for "function".
      // Create a fake object actor containing only "displayName" as replacement
      // for the no longer available obj.callee (see bug 1663847).
      // See bug 1664218 for cleanup.
      form.function = { displayName: this.obj.calleeScript.displayName };
    }

    // Shall we list this environment's bindings?
    if (this.obj.type == "declarative") {
      form.bindings = this.bindings();
    }

    return form;
  }

  /**
   * Handle a protocol request to fully enumerate the bindings introduced by the
   * lexical environment.
   */
  bindings() {
    const bindings = { arguments: [], variables: {} };

    // TODO: this part should be removed in favor of the commented-out part
    // below when getVariableDescriptor lands (bug 725815).
    if (typeof this.obj.getVariable != "function") {
      // if (typeof this.obj.getVariableDescriptor != "function") {
      return bindings;
    }

    let parameterNames;
    if (this.obj.calleeScript) {
      parameterNames = this.obj.calleeScript.parameterNames;
    } else {
      parameterNames = [];
    }
    for (const name of parameterNames) {
      const arg = {};
      const value = this.obj.getVariable(name);

      // TODO: this part should be removed in favor of the commented-out part
      // below when getVariableDescriptor lands (bug 725815).
      const desc = {
        value,
        configurable: false,
        writable: !value?.optimizedOut,
        enumerable: true,
      };

      // let desc = this.obj.getVariableDescriptor(name);
      const descForm = {
        enumerable: true,
        configurable: desc.configurable,
      };
      if ("value" in desc) {
        descForm.value = this.threadActor.createValueGrip(desc.value);
        descForm.writable = desc.writable;
      } else {
        descForm.get = this.threadActor.createValueGrip(desc.get);
        descForm.set = this.threadActor.createValueGrip(desc.set);
      }
      arg[name] = descForm;
      bindings.arguments.push(arg);
    }

    for (const name of this.obj.names()) {
      if (
        bindings.arguments.some(function exists(element) {
          return !!element[name];
        })
      ) {
        continue;
      }

      const value = this.obj.getVariable(name);

      // TODO: this part should be removed in favor of the commented-out part
      // below when getVariableDescriptor lands.
      const desc = {
        value,
        configurable: false,
        writable: !(
          value &&
          (value.optimizedOut || value.uninitialized || value.missingArguments)
        ),
        enumerable: true,
      };

      // let desc = this.obj.getVariableDescriptor(name);
      const descForm = {
        enumerable: true,
        configurable: desc.configurable,
      };
      if ("value" in desc) {
        descForm.value = this.threadActor.createValueGrip(desc.value);
        descForm.writable = desc.writable;
      } else {
        descForm.get = this.threadActor.createValueGrip(desc.get || undefined);
        descForm.set = this.threadActor.createValueGrip(desc.set || undefined);
      }
      bindings.variables[name] = descForm;
    }

    return bindings;
  }
}

exports.EnvironmentActor = EnvironmentActor;
