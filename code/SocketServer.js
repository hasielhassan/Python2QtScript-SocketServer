

function socketserver() {

	this.control_action = function() {

		current_status = this.ui.main_grp.control_button.text;

		if (current_status == "Start Server") {

			this.ui.main_grp.console_output.appendPlainText("Preparing server...");

			this.server = new QTcpServer(this);

			var host = new QHostAddress("localhost");

			if (this.server.listen(host, 8080)) {

				this.ui.main_grp.console_output.appendPlainText("Server up and running, conect a client!...");
				this.ui.status_bar_grp.status_bar_label.text = "Listening...";
				this.ui.main_grp.control_button.text = "Stop Server";

				this.server.newConnection.connect(this, this.client_conection);

			}

			else {
				this.ui.main_grp.console_output.appendPlainText("Unable to start the server:");
				this.ui.main_grp.console_output.appendPlainText(this.server.errorString());
				this.ui.status_bar_grp.status_bar_label.text = "Waiting to start...";
				this.ui.main_grp.control_button.text = "Start Server";

				this.server.close()
			}
		}

		else {

			if (this.server) {
				this.ui.main_grp.console_output.appendPlainText("Stoping server...");
				this.server.close()
				this.ui.main_grp.console_output.appendPlainText("Server succesfully stoped...");
				this.ui.status_bar_grp.status_bar_label.text = "Waiting to start...";
				this.ui.main_grp.control_button.text = "Start Server";
			}
		}
	}

	this.client_conection = function() {

		this.ui.main_grp.console_output.appendPlainText("New connection!!");

		if (this.server.hasPendingConnections()) {

			this.ui.main_grp.console_output.appendPlainText("Processing client...");

			this.client = this.server.nextPendingConnection()

			this.ui.main_grp.console_output.appendPlainText("Validating client...");

			this.ui.main_grp.console_output.appendPlainText(this.client);


			state = this.client.state()

			this.ui.main_grp.console_output.appendPlainText(state);


			while (true) {

				data = this.client.readAll()

				if (data.size() != 0) {

					var command = "";

					for ( var i = 0; i < data.size(); ++i) {
						command = command.concat(String.fromCharCode(data.at(i)));
					}

					this.ui.main_grp.console_output.appendPlainText(command);

					if (command.substring(0,6) == ":code:") {

						this.ui.main_grp.console_output.appendPlainText("Evaluating QTScript code commands...");

						var code = command.replace(":code:", ""); 

						this.ui.main_grp.console_output.appendPlainText(code);

						try {

							var result = eval(code);
						}

						catch (error) {

							var result = "Error, evaluating code!!...";
						}

						

						this.ui.main_grp.console_output.appendPlainText(result);

					}


					if (command == "quit") {

						if (this.server) {
							this.ui.main_grp.console_output.appendPlainText("Stoping server...");
							this.server.close()
							this.ui.main_grp.console_output.appendPlainText("Server succesfully stoped...");
							this.ui.status_bar_grp.status_bar_label.text = "Waiting to start...";
							this.ui.main_grp.control_button.text = "Start Server";

							break;
						}

					}
				}
			}
		}

		else {
			this.ui.main_grp.console_output.appendPlainText("Fake client...");
		}

	}

	//// <load ui>
		this.ui = UiLoader.load("D:/Development/works/qtscriptsnipets/Python2QtScript-SocketServer/code/SocketServer.ui");
		ui.show();
	 ///// </load ui>
		this.ui.main_grp.control_button.clicked.connect(this, this.control_action);

		this.ui.status_bar_grp.status_bar_label.text = "Waiting to start...";
}