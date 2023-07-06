import werkzeug
import flask
from flask import jsonify
from flask import render_template
import graphene
from flask_graphql import GraphQLView
from graphql.utils import schema_printer
import click


class Query(graphene.ObjectType):
    # this defines a Field `hello` in our Schema with a single Argument `first_name`
    # By default, the argument name will automatically be camel-based into firstName in the generated schema
    hello = graphene.String(first_name=graphene.String(default_value="stranger"))
    goodbye = graphene.String()

    # our Resolver method takes the GraphQL context (root, info) as well as
    # Argument (first_name) for the Field and returns data for the query Response
    def resolve_hello(root, info, first_name):
        return f'Hello {first_name}!'

    def resolve_goodbye(root, info):
        return 'See ya!'

schema = graphene.Schema(query=Query)


app = flask.Flask(__name__, template_folder='srv_templates', static_folder='srv_static')

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/hello")
def hello_world():
    return jsonify({"message": "hello from flask"})

app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
    )
)


@click.group()
def cli():
    pass

@cli.command()
def gql_schema():
    my_schema_str = schema_printer.print_schema(schema)
    with open("schema.graphql", "w") as fp:
        fp.write(my_schema_str)
        fp.close()

@cli.command()
def run_app():
    werkzeug.serving.run_simple(
        "0.0.0.0",
        5000,
        app,
        use_debugger=True,
        use_reloader=True,
    )


if __name__ == '__main__':
    cli()
