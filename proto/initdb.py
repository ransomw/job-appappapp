from models import get_engine, metadata_obj

engine = get_engine()
metadata_obj.create_all(engine)
